/**
 * Created by Frank on 15/8/5.
 */


define(['jquery', 'qiniu', 'layerWrapper'], function ($, Qiniu, layer) {


    var uploadProgress = $('<div class="upload-progress-layout" id="upload-progress-layout"> ' +
        '<div class="header"> <div class="caption"><i class="fa fa-cloud-upload"></i>文件上传列表</div></div>' +
        '<ul></ul>' +
        '<div class="materials-upload-btn"> <button class="layer-ok-btn disabled" disabled>处理中...</button> ' +
        '</div> </div>');
    $('body').append(uploadProgress);


    /**
     * 进度条
     * @param file
     * @constructor
     */
    function FileProgress(file) {
        this.fileProgressId = file.id;
        this.file = file;
        this.fileProgressWrapper = $('#' + this.fileProgressId);
        if (!this.fileProgressWrapper.length) {
            var html = '';
            html += '<li id="' + this.fileProgressId + '" >';
            html += '<div class="left-content">';
            html += '<div class="title">';
            html += '<div class="content">' + file.name + '  (' + plupload.formatSize(file.size) + ')';
            html += '</div>';
            html += '<div class="right-content"><div class="del-button delete"></div></div>';
            html += '</div>';
            html += '<div class="progress-frame">';
            html += '<div class="progress" style="width: 1%;"></div>';
            html += '</div>';
            html += '<div class="progress-information">';
            html += '<span class="proportion"></span><span class="speed"></span>';
            html += '</div>';
            html += '</div>';
            html += '</li>';
            uploadProgress.find('ul').append(html);
            this.fileProgressWrapper = $('#' + this.fileProgressId);
        }
    }

    FileProgress.prototype.setStatus = function (status) {
        this.fileProgressWrapper.find('.status').html(status);

    };

    FileProgress.prototype.setOk = function () {
        this.fileProgressWrapper.find('.progress-information').html('完成');
        this.fileProgressWrapper.find('.delete').unbind('click').remove();
    };

    FileProgress.prototype.setError = function (error) {
        this.fileProgressWrapper.find('.progress-information').css('color', 'red').html(error);
    };

    FileProgress.prototype.setProgress = function (percentage, speed) {
        var formatSpeed = plupload.formatSize(speed).toUpperCase();
        this.fileProgressWrapper.find('.progress').css('width', percentage);
        this.fileProgressWrapper.find('.proportion').html(percentage);
        this.fileProgressWrapper.find('.speed').html('速度: ' + formatSpeed + '/秒');
    };

    FileProgress.prototype.setDelete = function (up) {
        var file = this.file;
        var that = this;
        this.fileProgressWrapper.find('.delete')
            .unbind('click')
            .click(function () {
                up.removeFile(file);
                that.fileProgressWrapper.remove();
            });
    };

    var uploader = function (options) {
        var ops = options || {};

        return Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: ops.browseButton || 'local_image_upload',
            max_file_size: ops.maxFileSize,
            filters: {mime_types: ops.mimeTypes},
            flash_swf_url: 'swf/Moxie.swf',
            dragdrop: false,
            chunk_size: '4mb',
            uptoken_url: ops.tokenURL || '/api/v1/imageToken',
            domain: 'http://resource.hizuoye.com',
            save_key: true,
            x_vars: {schoolId: user.schoolId || user._id},
            multi_selection: ops.multi || false,
            auto_start: true,
            init: {
                'FilesAdded': function (up, files) {
                    plupload.each(files, function (file) {
                        var progress = new FileProgress(file);
                        progress.setDelete(up);
                        progress.setStatus('等待中...');
                    });

                    layer.open(uploadProgress, function (index) {
                        var files = up.files;
                        if (files.length === 0) {
                            layer.close(index);
                            return;
                        }
                        if (ops.onComplete) {
                            if (!ops.multi) {
                                files = files[0];
                            }
                            ops.onComplete(files, function () {
                                layer.close(index);
                                up.splice(0); // 删除队列中所有文件
                                uploadProgress.find('ul').empty();
                            });
                        }
                    }, function () {
                        uploadProgress.find('ul').empty();
                        up.splice(0); // 删除队列中所有文件
                    });
                },

                'UploadProgress': function (up, file) {
                    var progress = new FileProgress(file);
                    progress.setProgress(file.percent + "%", file.speed);
                    console.log(file);
                },

                'UploadComplete': function () {
                    uploadProgress.find('button.layer-ok-btn')
                        .attr('disabled', false)
                        .text('确定');
                },

                'FileUploaded': function (up, file, info) {
                    file.key = $.parseJSON(info).key;
                    file.url = 'http://resource.hizuoye.com/' + file.key;
                    var progress = new FileProgress(file);
                    progress.setOk();
                },

                'Error': function (up, err, errTip) {
                    if (up.files.length === 0) {
                        layer.msg(errTip);
                    } else {
                        var progress = new FileProgress(err.file);
                        progress.setDelete(up);
                        progress.setError(errTip);
                    }
                }
            }
        });
    };

    var imgUploader = function (options) {
        var ops = options || {};
        ops.browseButton = options.browseButton || 'local_image_upload';
        ops.mimeTypes = [{title: "Image files", extensions: "jpg,jpeg,gif,png"}];
        ops.tokenURL = '/api/v1/imageToken';
        ops.maxFileSize = '2mb';
        return uploader(ops);
    };

    var audioUploader = function (options) {
        var ops = options || {};
        ops.browseButton = options.browseButton || 'localAudioUploadButton';
        ops.mimeTypes = [{title: "Audio files", extensions: "mp3"}];
        ops.tokenURL = '/api/v1/audioToken';
        ops.maxFileSize = '5mb';
        return uploader(ops);
    };

    return {
        imgUploader: imgUploader,
        audioUploader: audioUploader
    };
});
